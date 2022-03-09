import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate'


// for filtering
const LithuaniaArea = 365;
const Region = "Oceania"


//interfaces
 interface Country {
name : string,
region: string,
area: number,
independent : boolean
}

 interface Countries {
  countries : Country[]
}

 interface PaginatedCountries {
  items : Country[],
  itemsPerPage : number
}





function countryTemplate(data : Country) {
  const { name, region, area, independent } = data;
  return `
  
  <div className='items-container'>
  <p className='countryProp'>Country name : ${name}</p>
  <p className='countryProp'>Country region : ${region}</p>
  <p className='countryProp'>Country area : ${area}</p>

</div>

  `;
}


function App() {
 

  const[countries, setCountries] = useState<Country[]>([])  // initial data
  const[countriesDisplay, setCountriesToBeDisplayed] = useState<Country[]>([])  // data after filtering

  const getData = async () =>{
    const res   = await axios.get('https://restcountries.com/v2/all?fields=name,region,area');
    const data = res.data
    let dataArr : Country[] = [];
    for (var i = 0; i < data.length; i++){
      dataArr.push(data[i]);
    }
  
    setCountries(dataArr)
    setCountriesToBeDisplayed(dataArr)
   return dataArr
  }
 



  const itemsContainer = document.querySelector(".items-container");
  const all = document.querySelector(".allCountries");
  const ascButton = document.querySelector(".ascendingButton")
  const descButton = document.querySelector(".descendingButton")
  const smallerButton = document.querySelector(".smallerThan")
  const regionButton = document.querySelector(".oceaniaRegion")
  
  const handleAllCountries = () =>{
   
    setCountriesToBeDisplayed(countries)
    renderProjectsToDom(countriesDisplay)
  }
  const handleAscClick = ()  =>{
    filterCountriesAscending()
    renderProjectsToDom(countriesDisplay)
  }

  
  const handleDescClick = ()  =>{
    filterCountriesDescending()
    renderProjectsToDom(countriesDisplay)
  }

  const handleSmallerFilter = () =>{
    filterCountriesSmallerThan(LithuaniaArea)
    renderProjectsToDom(countriesDisplay)
  }
  const handleRegionFilter = () =>{
    filterRegion(Region)
    renderProjectsToDom(countriesDisplay)
  }

   if (ascButton!== null){
   ascButton.addEventListener("click", handleAscClick);
   }
   if (descButton!== null){
    descButton.addEventListener("click", handleDescClick);
    }
    
    if (all !== null){
      all.addEventListener("click", handleAllCountries)
    }

   if (smallerButton !== null){
    smallerButton.addEventListener("click", handleSmallerFilter);
   }
   if (regionButton !== null){
    regionButton.addEventListener("click", handleRegionFilter)
   }

  async function handleInitialLoad() {
    const data = await getData();
    renderProjectsToDom(data);
  }
  
  
  function renderProjectsToDom(data :Country[]) {
    let items = data.map((item) => countryTemplate(item)).join("");
    if (itemsContainer !== null){
    itemsContainer.innerHTML = items;}
   
  }

  
 function compareAsc (a: Country, b: Country){
 
   if (a.name > b.name){
     return 1;
   }
   else if (a.name < b.name){ 
   return -1;
   }
   else return 0;
 }

 function compareDesc (a: Country, b: Country){
 
  if (a.name > b.name){
    return -1;
  }
  else if (a.name < b.name){ 
  return 1;
  }
  else return 0;
}

const filterCountriesSmallerThan = (x : number) =>{
    const data : Country[] = countries.filter(c => c.area < x);
    setCountriesToBeDisplayed(data);
}

const filterRegion = (r : string) =>{
  const data : Country[] = countries.filter(c => c.region === r);
    setCountriesToBeDisplayed(data);
}

const filterCountriesAscending = () =>{
  var c = countriesDisplay.sort(compareAsc)
  setCountriesToBeDisplayed(c);
  
}
const filterCountriesDescending = () =>{
  var c = countriesDisplay.sort(compareDesc)
  setCountriesToBeDisplayed(c);
  
}

window.addEventListener("DOMContentLoaded", handleInitialLoad);
  return (
    <div className="App">
    
    <div className='head'>
      <div className='main'>
        <h1>
          HIRE ME!
        </h1>
    </div>
    <div className='filters'>
    <span className='sortButtons'>
        <button  className="ascendingButton btn">
          Ascending by name
        </button>
        <button className="descendingButton btn">
          Descending by name
         
        </button>

      </span>

      <div className="dropdown">
      <button className='dropdownHeader btn'>Filters</button>
      <div className="dropdownContent">
        <button className='allCountries'>All countries</button>
        <button className='smallerThan'>Smaller than Lithuania</button>
        <button className='oceaniaRegion'>Oceania region</button> 
       
</div>

</div>
</div>


     </div>
     <PaginatedItems items={countriesDisplay}
     itemsPerPage={25}/>

     {/* <CountryList countries={countriesDisplay} /> */}   
   
      
    </div>

    
  );
}


const CountryList : React.FC<Countries> = ({countries}) =>{

return(
        <div className='alignCenter'>
        <div className='countriesContainer'>
    
     
        {countries.map((country : Country, inx : number)=>(
          <div className='country' key = {inx}>
            <p className='countryProp'>Country name : {country.name}</p>
            <p className='countryProp'>Country region : {country.region}</p>
            <p className='countryProp'>Country area : {country.area}</p>
      
          </div>
        ))}   
          
        </div>
        </div>

);
 }

const PaginatedItems :React.FC<PaginatedCountries>  = ({items, itemsPerPage}) => {
 
  const [currentItems, setCurrentItems] = useState<Country[]>([]);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  
  useEffect(() => {
    
    const endOffset = itemOffset + itemsPerPage;
   
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  
    setCurrentItems(items.slice(itemOffset, endOffset));
    
    setPageCount(Math.ceil(items.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, items]);

  
  const handlePageClick = (event : any) => {
    const newOffset = (event.selected * itemsPerPage) % items.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
  };
  

  return (
    <>
   
       <CountryList countries={currentItems} /> 
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={pageCount}
        previousLabel="<"
        activeClassName="active"
       
      />
    </>
  );
}


export default App;
