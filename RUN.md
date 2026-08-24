# How to run Steady from a blank computer

You start with **nothing installed**. Pick **one** operating system section, run **every command in order**.

Steady uses **open-weight Llama**. On a laptop, use **Groq-hosted Llama** (fast, does not freeze the Mac). Local Ollama is only for machines that can run a ~5GB model. There is **no OpenAI key**. Do not paste secrets into git.

**If Ollama already froze your Mac:** quit the Ollama app, add `GROQ_API_KEY` in `.env.local`, comment out `OLLAMA_BASE_URL`, restart `pnpm dev`. Chat still uses Llama — it just does not run on your laptop.

**You do not need Xcode.** Xcode.app is 10GB+. Skip it. Skip Homebrew too if you do not want Command Line Tools.

---

## A. Mac without Xcode (recommended if disk is tight)

Do **not** run `xcode-select --install`. Do **not** install Homebrew. Do **not** install Xcode from the App Store.

### A1. Node (small installer)

1. Open https://nodejs.org
2. Download **LTS** → macOS Installer (`.pkg`)
3. Open the `.pkg` and click through Continue / Install
4. Quit and reopen **Terminal**

```bash
node -v
npm -v
sudo mkdir -p /usr/local/bin
sudo corepack enable
corepack prepare pnpm@9.12.3 --activate
pnpm -v
```

If `corepack` is missing:

```bash
sudo npm install -g pnpm@9.12.3
pnpm -v
```

### A2. Groq key (hosted Llama — skip Ollama on a laptop)

`llama3.1` on a Mac will freeze many machines. Use Groq instead. Still Llama, not GPT.

1. Open https://console.groq.com/keys
2. Create a free account
3. Create an API key and copy it (starts with `gsk_`)
4. If the Ollama app is open, quit it from the menu bar so it stops using RAM

### A3. Project zip (no git)

In Terminal:

```bash
cd ~
curl -L "https://github.com/rauni9869/mental-health-ai-chatbot/archive/refs/heads/cursor/steady-wellness-assistant-c31f.zip" -o steady.zip
unzip -o steady.zip
cd mental-health-ai-chatbot-cursor-steady-wellness-assistant-c31f
```

If `curl` or `unzip` errors, in Safari open that same URL, unzip the download, then:

```bash
cd ~/Downloads/mental-health-ai-chatbot-cursor-steady-wellness-assistant-c31f
```

(Folder name may differ slightly; `cd` into the folder that contains `package.json`.)

### A4. Free Postgres (no Docker)

Docker is large. Use a free hosted database instead.

1. Open https://neon.tech and sign up
2. Create a project (default region is fine)
3. Copy the **connection string** (starts with `postgres://` or `postgresql://`)

Then in the project folder:

```bash
cd ~/mental-health-ai-chatbot-cursor-steady-wellness-assistant-c31f
# if that path fails, cd to wherever package.json is

python3 -c 'import secrets; print(secrets.token_urlsafe(32))'
```

Copy the printed secret. Create env (replace the three placeholders):

```bash
cat > .env.local <<'EOF'
AUTH_SECRET=PASTE_THE_SECRET_HERE
POSTGRES_URL=PASTE_THE_NEON_URL_HERE
GROQ_API_KEY=PASTE_THE_GROQ_KEY_HERE
GROQ_CHAT_MODEL=llama-3.1-8b-instant
GROQ_REASONING_MODEL=llama-3.3-70b-versatile
GROQ_SMALL_MODEL=llama-3.1-8b-instant
EOF
```

If Neon’s URL contains `&` or quotes, wrap the value in double quotes in `.env.local`.

### A5. Install, migrate, model, run

```bash
pnpm install
pnpm db:migrate
pnpm dev
```

Quit **Ollama** from the menu bar (the llama icon) so it is not using RAM. Chat goes to Groq, not to `llama3.1` on the Mac.

Wait for **Ready**, then open:

- http://localhost:3000
- http://localhost:3000/app

Later sessions:

```bash
cd ~/mental-health-ai-chatbot-cursor-steady-wellness-assistant-c31f
pnpm dev
```

---

## A-alt. macOS with Homebrew (needs Command Line Tools, not Xcode)

Only if you are fine with a ~2GB **Command Line Tools** install. This is still **not** Xcode.app.

Open **Terminal** (Spotlight → Terminal).

```bash
xcode-select --install
```

Click **Install** in the popup and wait until it finishes. Then:

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

When Homebrew prints “Next steps”, run the two `echo` / `eval` lines it shows. On Apple Silicon they look like this:

```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

On Intel Macs, Homebrew is usually `/usr/local`:

```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/usr/local/bin/brew shellenv)"
```

```bash
brew update
brew install git node@20 openssl
brew link --overwrite node@20
npm install -g pnpm@9.12.3
brew install --cask docker
brew install --cask ollama
open -a Docker
open -a Ollama
```

Wait until the **Docker Desktop** whale icon is idle (not “starting…”). Confirm:

```bash
git --version
node -v
pnpm -v
docker --version
docker compose version
ollama --version
```

`node -v` should be **v20**. Then skip to **D. Project commands**.

---

## B. Windows (use WSL — this app’s setup script is bash)

On Windows, do **not** try to run this only in PowerShell. Install **WSL Ubuntu**, then run Linux commands inside Ubuntu.

Open **PowerShell as Administrator**:

```powershell
wsl --install -d Ubuntu
```

Reboot if Windows asks. After reboot, open **Ubuntu** from the Start menu, create a UNIX username and password.

Still on Windows, install **Docker Desktop**:

1. Download: https://www.docker.com/products/docker-desktop/
2. Install, start Docker Desktop
3. Settings → Resources → WSL Integration → enable **Ubuntu**

In the **Ubuntu** terminal:

```bash
sudo apt-get update
sudo apt-get install -y curl git openssl ca-certificates build-essential
curl -fsSL https://ollama.com/install.sh | sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
```

Close Ubuntu and open it again (so `nvm` loads), then:

```bash
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
npm install -g pnpm@9.12.3
```

Confirm:

```bash
git --version
node -v
pnpm -v
docker --version
docker compose version
ollama --version
```

If `docker` fails from Ubuntu, Docker Desktop is not running or WSL integration is off.

Then skip to **D. Project commands** (stay in Ubuntu).

---

## C. Ubuntu / Debian Linux

```bash
sudo apt-get update
sudo apt-get install -y curl git openssl ca-certificates build-essential gnupg
```

**Docker Engine** (official):

```bash
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo usermod -aG docker "$USER"
```

Log out and back in (or reboot) so Docker works without `sudo`. Then:

```bash
curl -fsSL https://ollama.com/install.sh | sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 20
nvm use 20
npm install -g pnpm@9.12.3
```

Confirm:

```bash
git --version
node -v
pnpm -v
docker --version
docker compose version
ollama --version
```

Then **D. Project commands**.

---

## D. Project commands (all operating systems)

You need Docker **running** before this.

```bash
cd ~
git clone https://github.com/rauni9869/mental-health-ai-chatbot.git
cd mental-health-ai-chatbot
git fetch origin
git checkout cursor/steady-wellness-assistant-c31f
chmod +x scripts/setup-local.sh
pnpm setup:local
```

`pnpm setup:local` writes **gitignored** `.env.local` (cookie secret + Postgres URL + Ollama), starts Postgres, installs packages, migrates the database.

Pull the model (several GB, once):

```bash
ollama serve
```

Leave that terminal open if it stays in the foreground. **Open a second terminal**, `cd` to the same repo folder, then:

```bash
cd ~/mental-health-ai-chatbot
ollama pull llama3.1
```

Wait until the pull reaches 100%. Then:

```bash
pnpm dev
```

Wait until you see **Ready**.

### Open these in the browser

- http://localhost:3000 — public site
- http://localhost:3000/app — chat (guest session is created here)
- http://localhost:3000/breathe — breathing timer
- http://localhost:3000/check-ins — mood log
- http://localhost:3000/skills — skills
- http://localhost:3000/register — optional account

### Optional check

In a third terminal:

```bash
cd ~/mental-health-ai-chatbot
pnpm test:unit
```

In the chat, try: `I feel a panic wave, help me ride it out.`

---

## If chat fails

```bash
ollama list
curl -s http://127.0.0.1:11434/api/tags
```

You should see `llama3.1`. If not:

```bash
ollama pull llama3.1
```

Postgres:

```bash
cd ~/mental-health-ai-chatbot
docker compose ps
docker compose logs postgres --tail 50
```

If port 3000 is busy:

```bash
pnpm dev -- --port 3001
```

Then use http://localhost:3001

---

## Optional: Groq (still not OpenAI)

Only if you do not want to run Llama on your PC. Create a key at https://console.groq.com/keys then:

```bash
cd ~/mental-health-ai-chatbot
nano .env.local
```

Add this line (your real key, never commit the file):

```bash
GROQ_API_KEY=gsk_paste_here
```

Delete or comment the `OLLAMA_BASE_URL` line. Save. Restart:

```bash
pnpm dev
```

---

## What not to do

- Do not install or set `OPENAI_API_KEY`
- Do not commit `.env.local`
- Do not treat this app as therapy or a crisis line
