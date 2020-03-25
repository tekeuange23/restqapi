# RestqAPI

> REST API Functional Test engine based on Gerkin 

## What is RestqAPI ?

## Getting started

### Configuration

```
# .restqa.yml

---

code: BU-API
name: My Business API
description: The decription of the business api
environments:
  - name: local
    url: http://localhost:8080
    reports:
      - type: file
        enable: true
        config:
          path: 'https://httpdump.io/lb8f7'
          method: 'POST'
      - type: elastic-search
        enable: false
        config:
          url: 'http://localhost:9200'
  - name: uat
    url: https://www.my-api-gateway.com
    reports:
      - type: elastic-search
        enable: true
        config:
          url: 'http://my-enterprise-elk:9200'
          index: 'custom-index-name'
      - type: http
        enable: true
        config:
          url: 'https://custom-report-endpoint.com'
          method: 'POST'
```

## Usage

Running in the current folder (by default the `.restqa.yml` need to be placed in the current folder)

```
API_ENV=local restqapi .
```

or 

```
restqa -e local
```

Running in the current folder with a specific config file

```
restqapi -c ../myconfig.yml .
```

### Docker








