import React, { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import ReactPaginate from 'react-paginate'
import { collapseTextChangeRangesAcrossMultipleVersions } from 'typescript';


// for filtering
const LithuaniaArea = 65300;
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

const CountriesDisplay =(countries : Country[])=>{
  return(
    <div>
      {countries.map((c: Country, key : number)=>{
          <div className='items-container' key={key}>
          <p className='countryProp'>Country name : ${c.name}</p>
          <p className='countryProp'>Country region : ${c.region}</p>
          <p className='countryProp'>Country area : ${c.area}</p>
        </div>
      })}
  

    </div>
  )
}


function App() {
 

  const[countries, setCountries] = useState<Country[]>([])  // initial data
  const[countriesDisplay, setCountriesToBeDisplayed] = useState<Country[]>([])  // data after filtering
  const [test, setTest] = useState("none")
 const [initialCountries, setInitialCountries] = useState<Country[]>([])
  const getData = async () =>{
    const res   = await axios.get('https://restcountries.com/v2/all?fields=name,region,area');
    const data = res.data
    let dataArr : Country[] = [];
    for (var i = 0; i < data.length; i++){
      dataArr.push(data[i]);
    }
  
    setCountries(dataArr)
    setInitialCountries(dataArr)
   return dataArr
  }
  useEffect(() => {
    getData();
     
  },[]);

 
 

  const sortCountriesAscending = () =>{
    setCountries(countries.sort(compareAsc));
    setTest("asc")   // why did it helped??????
    console.log(countries)
  }
  const sortCountriesDescending = () =>{
    setCountries(countries.sort(compareDesc))
    setTest("desc")
    console.log(countries)
   
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
    setCountries(data);
}

const filterRegion = (r : string) =>{
  const data : Country[] = countries.filter(c => c.region === r);
    setCountries(data);
}

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
        <button  className="ascendingButton btn" onClick={()=>sortCountriesAscending()}>
          Ascending by name
        </button>
        <button className="descendingButton btn" onClick={()=>sortCountriesDescending()}>
          Descending by name
         
        </button>

      </span>

      <div className="dropdown">
      <button className='dropdownHeader btn'>Filters</button>
      <div className="dropdownContent">
        <button onClick={()=>setCountries(initialCountries)} className='allCountries'>All countries</button>
        <button onClick={()=>filterCountriesSmallerThan(LithuaniaArea)} className='smallerThan'>Smaller than Lithuania</button>
        <button onClick={()=>filterRegion("Oceania")}className='oceaniaRegion'>Oceania region</button> 
       
</div>

</div>
</div>


     </div>
     {/* <PaginatedItems items={countriesDisplay}
     itemsPerPage={25}/> */}

     <CountryList countries={countries} />   
        
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
