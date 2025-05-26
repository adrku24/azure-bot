export class UserAddress {

    _id;
    _streetAddress;
    _city;
    _stateProvince;
    _postalCode;
    _country;
    _addressType;

    constructor(id, streetAddress, city, stateProvince, postalCode, country, addressType) {
        this._id = id;
        this._streetAddress = streetAddress;
        this._city = city;
        this._stateProvince = stateProvince;
        this._postalCode = postalCode;
        this._country = country;
        this._addressType = addressType;
    }

    getId = () => this._id;
    getStreetAddress = () => this._streetAddress;
    getCity = () => this._city;
    getStateProvince = () => this._stateProvince;
    getPostalCode = () => this._postalCode;
    getCountry = () => this._country;
    getAddressType = () => this._addressType;

}
