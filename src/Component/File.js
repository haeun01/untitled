// 서버에서 받은 그림 파일을 변환하여 src에 넣을 값 리턴
export function getServerImgFile(base64) {
    const byteArrays = getServerImgByteArrays(base64);

    const blob = new Blob(byteArrays, { type: 'image/png' });

    return URL.createObjectURL(blob);
}

// 서버에서 받은 그림 파일을 바이트배열로 변환하여 리턴
export function getServerImgByteArrays(base64) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512);
        const byteNumbers = new Array(slice.length);
        
        for (let i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }

    return byteArrays;
}
