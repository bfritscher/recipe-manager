# recipe-manager

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### Cloud Functions

pip install functions-framework
functions_framework --port 8082 --target=scrape_recipe
gcloud functions deploy scrape_recipe --entry-point scrape_recipe --runtime python38 --trigger-http --allow-unauthenticated
