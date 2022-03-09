import { Country } from "./App"

export const CountryList : React.FC<Country[]> = (countries) =>{
  const c : Country[] = countries;
return(
        <div className='alignCenter'>
        <div className='countriesContainer'>
        hey
       {console.log(c)}
        {countries.map(((country : Country, inx : number)=>(
          <div className='country'>
            <p className='countryProp'>Country name : {country.name}</p>
            <p className='countryProp'>Country region : {country.region}</p>
            <p className='countryProp'>Country area : {country.area}</p>
      
          </div>
        )))}   
          
        </div>
        </div>

);
      }
