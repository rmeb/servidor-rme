# servidor-rme
Servidor de Recetas Medicas Electrónicas

## API Description

Para guardar y recuperar una receta se usa el RUN del paciente y un PIN (Personal Identification Number) el cual es generado por el usuario.

### Guardar Receta

`POST /receta`

Permite guardar una receta

#### Body
```
{
  receta: <xml de la receta>,
  rut_paciente: <rut del paciente>,
  pin: <pin de acceso a la receta>
}
```

#### Response

| Status |     Message    |                               |
|:------:|----------------|-------------------------------|
| 200    | Ok.            | Receta guardada               |
| 400    | Bad Request    | Parameter missing or invalid  |
| 500    | Internal Error | Internal error                |


### Recuperar una receta

`GET /receta/<id>`

Permite recuperar una receta guardada
El id es: `sha3(<run paciente>:<pin>)`

#### Response

| Status |     Message    |                               |
|:------:|----------------|-------------------------------|
| 200    | Ok.            | Receta recuperada             |
| 400    | Bad Request    | Parameter missing or invalid  |
| 403    | Forbidden      | Pin missing or invalid        |
| 404    | Not found      | Receta not found              |
| 500    | Internal Error | Internal error                |

#### Response data
```
{
  receta: <xml de la receta>
}
```

## Install
```
yarn install
```

## Environment
```
export DATABASE_URL="postgres://user:password@ip:port/database"
```

## Start Server (port 4000)
```
yarn start
```
