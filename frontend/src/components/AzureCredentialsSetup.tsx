import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
// Local file storage does not require configuration

interface AzureCredentialsSetupProps {
  onConfigured: () => void;
}

export function AzureCredentialsSetup({ onConfigured }: AzureCredentialsSetupProps) {
  // Azure Storage State
  const [storageConfig, setStorageConfig] = useState({
    accountName: localStorage.getItem('azure_storage_account') || '',
    containerName: localStorage.getItem('azure_storage_container') || '',
    sasToken: localStorage.getItem('azure_storage_sas') || ''
  });

  // Azure Database State
  const [dbConfig, setDbConfig] = useState({
    host: localStorage.getItem('azure_db_host') || '',
    database: localStorage.getItem('azure_db_name') || '',
    username: localStorage.getItem('azure_db_user') || '',
    password: localStorage.getItem('azure_db_password') || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSaveStorage = async () => {
    setIsLoading(true);
    try {
      toast.success("Local file storage enabled.");
      onConfigured();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDatabase = async () => {
    if (!dbConfig.host || !dbConfig.database || !dbConfig.username || !dbConfig.password) {
      toast.error("Please fill in all Azure Database fields");
      return;
    }

    setIsLoading(true);
    try {
      // Save to localStorage (in production, these should be in Supabase Secrets)
      localStorage.setItem('azure_db_host', dbConfig.host);
      localStorage.setItem('azure_db_name', dbConfig.database);
      localStorage.setItem('azure_db_user', dbConfig.username);
      localStorage.setItem('azure_db_password', dbConfig.password);

      toast.success("Azure Database configured successfully!");
      onConfigured();
    } catch (error) {
      console.error("Azure Database configuration error:", error);
      toast.error("Failed to configure Azure Database");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Azure Storage Configuration */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Azure Blob Storage Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="accountName" className="text-white/80">Storage Account Name</Label>
            <Input
              id="accountName"
              type="text"
              placeholder="mystorageaccount"
              value={storageConfig.accountName}
              onChange={(e) => setStorageConfig(prev => ({
                ...prev,
                accountName: e.target.value
              }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="containerName" className="text-white/80">Container Name</Label>
            <Input
              id="containerName"
              type="text"
              placeholder="uploads"
              value={storageConfig.containerName}
              onChange={(e) => setStorageConfig(prev => ({
                ...prev,
                containerName: e.target.value
              }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="sasToken" className="text-white/80">SAS Token</Label>
            <Input
              id="sasToken"
              type="password"
              placeholder="?sv=2021-06-08&ss=b&srt=sco..."
              value={storageConfig.sasToken}
              onChange={(e) => setStorageConfig(prev => ({
                ...prev,
                sasToken: e.target.value
              }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <Button 
            onClick={handleSaveStorage} 
            disabled={isLoading}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            {isLoading ? "Configuring..." : "Save Storage Configuration"}
          </Button>
        </CardContent>
      </Card>

      <Separator className="bg-white/20" />

      {/* Azure Database Configuration */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-white">Azure PostgreSQL Database Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dbHost" className="text-white/80">Database Host</Label>
            <Input
              id="dbHost"
              type="text"
              placeholder="myserver.postgres.database.azure.com"
              value={dbConfig.host}
              onChange={(e) => setDbConfig(prev => ({
                ...prev,
                host: e.target.value
              }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dbName" className="text-white/80">Database Name</Label>
            <Input
              id="dbName"
              type="text"
              placeholder="snacktrackdb"
              value={dbConfig.database}
              onChange={(e) => setDbConfig(prev => ({
                ...prev,
                database: e.target.value
              }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dbUser" className="text-white/80">Username</Label>
            <Input
              id="dbUser"
              type="text"
              placeholder="adminuser@myserver"
              value={dbConfig.username}
              onChange={(e) => setDbConfig(prev => ({
                ...prev,
                username: e.target.value
              }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dbPassword" className="text-white/80">Password</Label>
            <Input
              id="dbPassword"
              type="password"
              placeholder="Your secure password"
              value={dbConfig.password}
              onChange={(e) => setDbConfig(prev => ({
                ...prev,
                password: e.target.value
              }))}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
          </div>

          <Button 
            onClick={handleSaveDatabase} 
            disabled={isLoading}
            className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
          >
            {isLoading ? "Configuring..." : "Save Database Configuration"}
          </Button>
        </CardContent>
      </Card>

      <div className="text-sm text-white/60 space-y-2">
        <p><strong>For Production:</strong></p>
        <p>• Store these credentials in Supabase Edge Function Secrets</p>
        <p>• Never commit sensitive credentials to your repository</p>
        <p>• Use environment variables for development</p>
        <p>• Enable SSL connections for security</p>
      </div>
    </div>
  );
}