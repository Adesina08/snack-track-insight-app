import sys
import os
import tempfile
import platform
import ctypes.util
import whisper
import ffmpeg

if platform.system() == "Windows":
    original_find = ctypes.util.find_library

    def _patched_find_library(name: str):
        if name == "c":
            return "msvcrt.dll"
        return original_find(name)

    ctypes.util.find_library = _patched_find_library




def prepare_audio(path: str) -> str:
    """Convert the input file to a temporary WAV file suitable for Whisper."""
    out_fd, out_path = tempfile.mkstemp(suffix=".wav")
    os.close(out_fd)
    try:
        (
            ffmpeg.input(path)
            .output(out_path, ac=1, ar=16000, format="wav")
            .overwrite_output()
            .run(quiet=True)
        )
    except ffmpeg.Error as exc:
        os.remove(out_path)
        raise RuntimeError(f"ffmpeg conversion failed: {exc}") from exc
    return out_path


def main(file_path: str) -> None:
    temp_path = prepare_audio(file_path)
    model = whisper.load_model("base")
    result = model.transcribe(temp_path)
    os.remove(temp_path)
    print(result["text"])


if __name__ == "__main__":
    main(sys.argv[1])
