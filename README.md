# README

Given project is aimed to automate VK's [Authorization Code Flow](https://vk.com/dev/authcode_flow_user) process

# Usage

Setup configuration, i.e. in `config/development.json`:

```json
{
  "credentials": {
    "vk": {
      "login": "my-vk-login",
      "password": "my-vk-password",
      "client_id": "my-app-id",
      "client_secret": "my-app-secret",
      "redirect_uri": "https://example.com/callback"
    }
  }
}
```

and run:

```bash
node index.js
```

or in debug mode:

```
node index.js true
```
