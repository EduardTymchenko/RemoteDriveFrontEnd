export class ProgressIndicator {
    isVisual: boolean = false;
    value: number = 0;
    max: number = 100;
    amountFiles: number;
    isDone: boolean = false;
    isCancel: boolean = false;

    public amountFilesToSting(): string {
        if (this.amountFiles === 1) return '1 файл';
        if (this.amountFiles > 1 && this.amountFiles <= 4) return this.amountFiles + ' файла';
        if (this.amountFiles >= 5) return this.amountFiles + ' файлов';

    }
}
