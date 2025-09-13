import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Support = () => {
  return (
    <div className="min-h-screen gradient-secondary py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <Card className="glass-card hover-glow">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gradient text-center">
              Support
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 text-center">
              iBUILD’s office address is:<br />
              4960 13 ST SW Calgary, AB T2G 5M9
            </p>
            <div className="w-full h-96">
              <iframe
                title="iBUILD office location"
                className="w-full h-full rounded-md"
                loading="lazy"
                allowFullScreen
                src="https://www.google.com/maps?q=4960+13+ST+SW+Calgary,+AB+T2G+5M9&z=16&output=embed"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Support;
