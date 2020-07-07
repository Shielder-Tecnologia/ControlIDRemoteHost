var axios = require('axios');
const { raw } = require('body-parser');


module.exports = {
    dispAxios:
    async (options) => {
        
         if(options.data=='0')
             delete options.data;

        try{
            const rawResponse = await axios(options);                    
            return rawResponse.data 
             
        }catch(error){
            return error
        }
        
    },
    webAxios:
    async (url) => {
              
       try{
            const rawResponse = await axios.get(url);   
            return rawResponse.data
             
        }catch(error){
            return error
        }
   }

}