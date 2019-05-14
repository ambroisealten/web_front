export class Agency {

    constructor(public name: string, public place: string, public placeType: string) { }

    getName() {
      return this.name;
    }

    setName(name: string) {
      this.name = name;
    }

    getPlace() {
      return this.place;
    }

    setPlace(place: string) {
      this.place = place;
    }

    getPlaceType() {
      return this.placeType;
    }

    setPlaceType(placeType: string) {
      this.placeType = placeType;
    }

  }
