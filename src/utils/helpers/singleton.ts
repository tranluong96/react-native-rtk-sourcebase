class DataHelpSingleton {
    private static instance: DataHelpSingleton;
    private countryDevice: string;

    private constructor() {
        this.countryDevice = "JP";
    }

    public static getInstance(): DataHelpSingleton {
        if (!DataHelpSingleton.instance) {
            DataHelpSingleton.instance = new DataHelpSingleton();
        }
        return DataHelpSingleton.instance;
    }

    public getCountryDevice(): string {
        return this.countryDevice;
    }

    public setCountryDevice(country: string): void {
        this.countryDevice = country;
    }

}

export default DataHelpSingleton;