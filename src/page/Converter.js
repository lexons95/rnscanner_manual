import React, { useState, useEffect, useContext } from 'react';

import JSONInput from 'react-json-editor-ajrm';
import locale from 'react-json-editor-ajrm/locale/en';


const Converter = (props) => {
  const [ jsonObject, setJsonObject ] = useState([]);
  const [ convertResult, setConvertResult ] = useState([]);


  const handleConvert = () => {

  }
  return (
    <div className="base-page converter" style={{backgroundColor:'gray', height: '100%', width: '100%'}}>
      <JSONInput
        id          = 'a_unique_id'
        placeholder = { jsonObject }
        //colors      = { darktheme }
        locale      = { locale }
        height      = '550px'
      />
      <button onClick={handleConvert}>Convert</button>
      <JSONInput
        id          = 'a_unique_id'
        placeholder = { jsonObject }
        //colors      = { darktheme }
        locale      = { locale }
        height      = '550px'
      />
    </div>
  )
}

export default Converter;