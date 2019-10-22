### Требования

- Сохранение медиа файлов, перечисленных форматов _(CONTENT_EXTENSION)_
- Создание превью изображения для сохраняемых файлов
- Предварительная настройка:
	- Разрешения превью изображений
	- Путей к директориям для сохранения файлов

### Внешний интерфейс

Наружу предоставляется интерфейс `IUploader`.
Конкретный лоадер модуль должен определить внутри себя самостоятельно.

```typescript
import { Readable } from "stream";

enum CONTENT_EXTENSION {
	MP4 = "mp4",
	PNG = "png",
	GIF = "gif",
	JPEG = "jpeg"
}

interface IMetadata {
	width: number;
	height: number;
	duration: number;
}

type IUploader = (source: Readable, name: string, ext: CONTENT_EXTENSION) => Promise<IMetadata>;
```

### Пример использования

```typescript
import { createReadStream } from "fs";
import { getUploader } from "./uploader";

const source = createReadStream(process.cwd() + "/temp/1.jpg");

const upload: IUploader = getUploader({
	thumbnail: {
		width: 120
	},
	routes: {
		origin: `${process.cwd()}/temp/`,
		thumbnail: `${process.cwd()}/temp/thumbnail/`
	}
});

upload(source, "some-name", CONTENT_EXTENSION.JPEG)
	.then(
		(meta: IMetadata): void => {
			console.log(`
			width: ${meta.width}, 
			height: ${meta.height},
			duration: ${meta.duration} 
		`);
		}
	)
	.catch((err: Error): void => {
		console.log(err.message);
	});
```
