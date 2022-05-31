# Technologies

- Express.js
- [MikroORM](https://mikro-orm.io/)
- \+ Refer to root README.md

# Running backend in dev mode

Run these commands to start the backend service.

Prerequisites

- MongoDB installed
- Have Frontend code built at least once *(either by building it or running it in dev mode)*

1. **Install dependencies**

```bash
yarn install
```

2. **Run backend**

```bash
yarn dev
```

During this step, MongoDB will start using <u>**doas**</u> not sudo. Either make symlink for sudo or change the dev
script.  
Moreover, this means you have to click into the console window and type your password.

For doas to not ask for password, you can insert this line into `/etc/doas.conf`

```text
permit nopass username as root cmd mongod  # replace username with your username 
```

App is hot reloaded
