arsnova🍅cards - Installing Docker under Windows via WSL 2
---

The official installation guide for **Windows Subsystem for Linux** (WSL) can be found here: [https://docs.microsoft.com/en-us/windows/wsl/install-win10](https://docs.microsoft.com/en-us/windows/wsl/install-win10).

## Prerequisites

You need Windows 10. Older operating systems are not supported. If you are using an older Windows operating system, please use a virtual machine with Linux.

Supported Windows 10 Versions:
- For x64 systems: Version 1903 or higher, with Build 18362 or higher.
- For ARM64 systems: Version 2004 or higher, with Build 19041 or higher.

If you get an error during the installation that virtualization is not activated, it may be necessary to activate the virtualization in the firmware of your computer. With Intel e.g. `Intel-VT` or with AMD `AMD-V`.

## Installing WSL 2

Enable the WSL Feature by running following command as administrator in the PowerShell:
```bash
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
```

Enable the Virtual Machine Platform by running following command as administrator in the PowerShell:
```bash
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```

Now restart your computer.

Download the update according to your architecture:

| arch | download |
| --- | --- |
| x64 | https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_x64.msi |
| arm64 | https://wslstorestorage.blob.core.windows.net/wslblob/wsl_update_arm64.msi |

Install the upgrade by double clicking the downloaded file.

Set the WSL 2 as default by running following command as administrator in the PowerShell:
```bash
wsl --set-default-version 2
```

## Installing a Linux Distro on WSL 2 via Microsoft Store

You can install Linux distributions from the Microsoft Store: [https://aka.ms/wslstore](https://aka.ms/wslstore).

Restart your computer after installation has finished.

## Installing a Linux Distro on WSL 2 manually

If you don't want to use the Microsoft Store, you can also install distributions manually.

We recommend Ubuntu as Linux Distribution. Download the WSL Ubuntu package according to your architecture by running following command as administrator in the PowerShell:
```bash
# fisrt, switch to your home directory
cd ~

# for x64
Invoke-WebRequest -Uri https://aka.ms/wslubuntu2004 -OutFile Ubuntu.appx -UseBasicParsing

# for amd64
Invoke-WebRequest -Uri https://aka.ms/wslubuntu2004arm -OutFile Ubuntu.appx -UseBasicParsing
```

When the download is finished, install the Distro by running following command as administrator in the PowerShell:
```
Add-AppxPackage .\Ubuntu.appx
```

Restart your computer after installation has finished.

## Installing Docker in your WSL 2 Distro

Now it's time to start your Linux Distro! If you have Ubuntu installed, just start the `Ubuntu` App from your start menu.

First time you start the Distro, you will be asked for a username and a password. Just take them as you like.

You now are logged in to Ubuntu. First of all, update your sources:
```
sudo apt update
sudo apt -y dist-upgrade
sudo apt -y autoremove
```

Then install Docker as described in the official sources: [https://docs.docker.com/engine/install/ubuntu/](https://docs.docker.com/engine/install/ubuntu/).

```bash
sudo apt -y install \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release

curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg

# following for x64 arch
echo \
  "deb [arch=amd64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# following for arm64 arch
echo \
  "deb [arch=arm64 signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt update
sudo apt -y install docker-ce docker-ce-cli containerd.io

sudo curl -L "https://github.com/docker/compose/releases/download/1.28.5/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

sudo chmod +x /usr/local/bin/docker-compose
```

Now make shure the docker daemon is autostarting with WSL. Run `sudo visudo` and add the following line:
```
%sudo ALL=(ALL) NOPASSWD: /usr/bin/dockerd
```

Save and close. Then run `nano ~/.bashrc` and add the following block:
```
RUNNING=`ps aux | grep dockerd | grep -v grep`
if [ -z "$RUNNING" ]; then
    sudo dockerd >> ~/dockerd.log 2>&1 &
    disown
fi
```

Save and close. Now disconnect from your WSL. From PowerShell shutdown the WSL by running:
```
wsl --shutdown
```

Start the Ubuntu app and check that docker and docker-compose are running without issues:
```
sudo docker version
sudo docker-compose version
```

## Get access to the WSL file system

In your file browser, go to `\\wsl$\`.

Here is an overview of your WSL machines. Get on your machine. You can mount your machine as a network drive with a right click, then you will always have it in the navigation bar.

You should store all your files for development in this drive, preferably in your home directory under `/home/<your-username>`.

High-performance work is only possible if you store the files in this file system! You cannot work efficiently with a shared Windows volume!

You should call all your git commands from inside the WSL.

If you want to work on the code with your IDE on your host, use the network drive.

## Troubleshooting

If you get an error `cannot connect to docker daemon` make shure, your Distro uses WSL 2! Check this by running the following from PowerShell:
```
wsl -l -v
```

If it says `Version 1` you can upgrade it by running `wsl --set-version <name> 2`.

---
---
---

## FROM HERE OLD STUFF ... TO BE REVIEWED

**If you are about to clone the repository** you should disable EOL-conversions in git. Otherwise git for windows will convert all LF endings to CRLF endings. This will end up in images which can not be run.
```bash
git config --global core.autocrlf false
```
