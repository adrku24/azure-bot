# Azure Chatbot - Dokumentation

## Installationsanleitung

### 1. Azure Gruppe erstellen

Dieser Schritt ist optional. Es ist jedoch einfacherer Services einem Projekt zuzuordnen, wenn sie einer Gruppe angehören.

### 2. Azure "Static Web App" erstellen

- Fügen Sie ihren GitHub Account auf der Webseite hinzu
- Clone ggf. dieses Projekt
- Während des "Erstellens" der Static Web App wähle Ihr Repository mit dem Code aus diesem Projekt aus
- Klicke auf "Ja", falls Sie gefragt werden, ob Azure einen Storage Account für Mass Storage hinzufügen soll. Dort wird der "Static"-Inhalt, wie bspw. Bilder in Buckets gespeichert.
- Wählen Sie das Standard Tier aus, um anschließend den Key Vault verwenden zu können.
- Anschließend aktivieren Sie über "Settings" -> "Identitiy" Ihre App über Microsoft Entra ID (Die Option "Status" auf "On" stellen unter "System assigned")

### 3. Datenbank

- Erstellen Sie einen "Azure Database for MySQL flexible server" Service.
- Wählen Sie ihre Wunschregion und wieviel Speicher die Datenbank auf wie vielen Nodes die Datenbank haben soll
- Wählen Sie einen Benutzernamen und ein Passwort (Speichern Sie sich dieses ab)

### 4. Azure Key Vault

- Erstellen Sie einen Azure Key Vault
- Geben Sie sich anschließend über das "Access control" (IAM) - Tool vollen Zugriff auf den Key Vault, um Daten hochzuladen.
- Fügen Sie dafür einfach sich selbst als "Key Vault Administrator" hinzu
- Fügen Sie anschließend Ihre App als "Reader" hinzu (Diese Option ist nur dann aktiv, wenn Sie Microsoft Entra ID aktiviert haben)

### 5. KI

- Erstellen Sie ein neues KI-Projekt unter [ai.azure.com](ai.azure.com).
- Deployen Sie ein x-beliebiges Chat-Modell.
- Notieren Sie sich: API_KEY, API_VERSION, API_ENDPOINT, MODEL_NAME und API_DEPLOYMENT

### 6. Speech 2 Text

- Zurück zu [portal.azure.com](portal.azure.com)
- Erstellen Sie ein "Speech Service"
- Notieren Sie sich einen der beiden API-KEYs

### 7. Fügen Sie Ihre Daten in die Static Web App ein
- Gehen Sie in "Settings" -> "Environment variables"
- Befüllen Sie die Datei anhand der folgenden Key-Value Paare

Option (1) - Sie verwenden kein Azure Key Vault (aktuell Repo 'Main'):
```text
# Azure ChatGPT LLM Configuration
AZURE_OPENAI_API_KEY=""
AZURE_OPENAI_API_VERSION=""
AZURE_OPENAI_API_ENDPOINT=""
AZURE_OPENAI_API_MODEL_NAME=""
AZURE_OPENAI_API_DEPLOYMENT=""

# Azure Database
AZURE_MYSQL_HOST=""
AZURE_MYSQL_PORT=""
AZURE_MYSQL_USERNAME=""
AZURE_MYSQL_PASSWORD=""
AZURE_MYSQL_DATABASE_NAME=""

# Azure Speech Service
AZURE_SPEECH_KEY=""
AZURE_SPEECH_REGION=""

# Website password
UNLOCK=""
```

Option (2) - Sie verwenden einen Azure Key Vault (Repo 'Dev'):
```text
# Azure ChatGPT LLM Configuration
AZURE_OPENAI_API_VERSION=""
AZURE_OPENAI_API_ENDPOINT=""
AZURE_OPENAI_API_MODEL_NAME=""
AZURE_OPENAI_API_DEPLOYMENT=""

# Azure Database
AZURE_MYSQL_HOST=""
AZURE_MYSQL_PORT=""
AZURE_MYSQL_DATABASE_NAME=""

# Azure Speech Service
AZURE_SPEECH_REGION=""

# Key Vault
KEY_VAULT_NAME=""
TENNANT_ID=""
CLIENT_ID=""
CLIENT_SECRET=""
```

Fügen Sie dafür den Namen Ihres Vaults hinzu. Anschließend die TENNANT_ID Ihrer Web-App.<br>
CLIENT_ID und CLIENT_SECRET finden Sie in "Microsoft Entra ID".<br><br>
Speichern Sie die folgenden Key-Value Paare als "Secrets" in Ihrem Key-Vault.
Hier sind die Namen der Secrets:
```text
azure-mysql-password
azure-mysql-user
azure-openai-key
azure-speech-key
unlock-page
```
