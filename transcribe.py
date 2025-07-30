import sys

# Ensure UTF-8 output even on Windows consoles
if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")
import os
import tempfile
import platform
import ctypes.util
import whisper
import ffmpeg
import azure.cognitiveservices.speech as speechsdk

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


def transcribe_with_whisper(temp_path: str) -> str:
    model = whisper.load_model("base")
    result = model.transcribe(temp_path)
    return result["text"]


def transcribe_with_azure(temp_path: str) -> str:
    key = os.getenv("AZURE_SPEECH_KEY")
    region = os.getenv("AZURE_SPEECH_REGION")
    if not key or not region:
        raise RuntimeError("Azure Speech credentials not provided")
    speech_config = speechsdk.SpeechConfig(subscription=key, region=region)
    speech_config.speech_recognition_language = "en-US"
    audio_config = speechsdk.audio.AudioConfig(filename=temp_path)
    recognizer = speechsdk.SpeechRecognizer(
        speech_config=speech_config, audio_config=audio_config
    )
    result = recognizer.recognize_once()
    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        return result.text
    raise RuntimeError(f"Azure STT error: {result.reason}")


def main(file_path: str) -> None:
    temp_path = prepare_audio(file_path)
    try:
        if os.getenv("AZURE_SPEECH_KEY") and os.getenv("AZURE_SPEECH_REGION"):
            text = transcribe_with_azure(temp_path)
        else:
            text = transcribe_with_whisper(temp_path)
        print(text)
    finally:
        os.remove(temp_path)


if __name__ == "__main__":
    main(sys.argv[1])
