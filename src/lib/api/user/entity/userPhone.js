export class UserPhone {

    _id;
    _phoneNumber;
    _phoneType;

    constructor(id, phoneNumber, phoneType) {
        this._id = id;
        this._phoneNumber = phoneNumber;
        this._phoneType = phoneType;
    }

    getId = () => this._id;
    getPhoneNumber = () => this._phoneNumber;
    getPhoneType = () => this._phoneType;

}
