export class DataHelper {
    generateValidUsername(): string{
        let date = new Date();
        let dateTime:string = date.toLocaleString();
        let VALID_USERNAME = `qa_user_Username<${dateTime}>`;
        return VALID_USERNAME;
    }
}