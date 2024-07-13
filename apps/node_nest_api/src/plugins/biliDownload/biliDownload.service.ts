import { Injectable } from '@nestjs/common';
import { downloadByVedioPath } from './download';

@Injectable()
export class BiliDownloadService {
async download(url: string) {
    downloadByVedioPath({
        url,
        type: 'mp4',
        folder: ''
    })
}
}