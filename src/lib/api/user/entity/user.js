export class User {

    _id;
    _firstName;
    _lastName;
    _birthday;
    _address;
    _email;
    _phone;

    constructor(id, firstName, lastName, birthday, address, email, phone) {
        this._id = id;
        this._firstName = firstName;
        this._lastName = lastName;
        this._birthday = birthday;
        this._address = address;
        this._email = email;
        this._phone = phone;
    }

    getId = () => this._id;
    getFirstName = () => this._firstName;
    getLastName = () => this._lastName;
    getBirthday = () => this._birthday;
    getAddress = () => this._address;
    getEmail = () => this._email;
    getPhone = () => this._phone;
}
