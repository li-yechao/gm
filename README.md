# gm

Provide an api used to proxy a image url. It can do some useful operations on the picture,
like for example **autoOrient**, **resize**, **reduce quality**, **change format** etc.

## Build docker image

```shell
docker buildx build -t gm-server packages/server --load
```

## Start gm server

```shell
docker run --rm -it \
  -v /path-to-env:/app/.env \
  -v /static-file-path:/app/static \
  -p 8080:8080 \
  gm-server
```

## env 配置

```env
port=8080
cors=false

static.rootDir=./static
```

## API

### proxy

url：`/proxy`

query：

- `src` [required, type: `string`] The original image url
- `autoOrient` [optional, type: `1`] Remove `Orientation` from `EXIF`, like for example `autoOrient=1`
- `width` [optional, type: `number`] With of the result image you want
- `resizeMode` [optional, type: `%|<|>`]
  - `%` The `width` is specified in percents
  - `<` Change dimensions only if image is smaller than `width`
  - `>` Change dimensions only if image is larger than `width`
- `quality` [optional, type: `1 - 100`] The quality of image you want
- `format` [optional, type: `string`] The image format, like for example `png`, `jpg`, `webp` etc.
- `webp` [optional, type: `1`] Return `webp` format image if client supported. This option has a lower priority than `format`.

**Usage**：

The following options are recommended to improve efficiency.
And set the `src` option to end of query string is recommended to avoid
options not working.

`/proxy?autoOrient=1&webp=1&quality=70&width=750&resizeMode=>&src=...`

**Effect comparsion**

**Original**

URL: <https://gm.yechao.xyz/proxy?src=https://ipfs.yechao.xyz/ipfs/Qmdbok5MLQxcxcKMFNWKj5UiiANA9syyz6uHD3yYXn82EY>

File size: 417KB

<img style="width: 300px" src="https://gm.yechao.xyz/proxy?src=https://ipfs.yechao.xyz/ipfs/Qmdbok5MLQxcxcKMFNWKj5UiiANA9syyz6uHD3yYXn82EY" />

**Optimized**

URL: [https://gm.yechao.xyz/proxy?autoOrient=1&webp=1&quality=70&width=750&resizeMode=%3E&src=https://ipfs.yechao.xyz/ipfs/Qmdbok5MLQxcxcKMFNWKj5UiiANA9syyz6uHD3yYXn82EY](https://gm.yechao.xyz/proxy?autoOrient=1&webp=1&quality=70&width=750&resizeMode=%3E&src=https://ipfs.yechao.xyz/ipfs/Qmdbok5MLQxcxcKMFNWKj5UiiANA9syyz6uHD3yYXn82EY)

File size: 11KB (Chrome with webp support), 108KB (Safari without webp support)

<img style="width: 300px" src="https://gm.yechao.xyz/proxy?autoOrient=1&webp=1&quality=70&width=750&resizeMode=%3E&src=https://ipfs.yechao.xyz/ipfs/Qmdbok5MLQxcxcKMFNWKj5UiiANA9syyz6uHD3yYXn82EY" />
