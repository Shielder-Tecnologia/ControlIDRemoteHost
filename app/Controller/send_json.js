var fetch = require('node-fetch');



module.exports = {
    dispFetch:
    async (url,options) => {
        
         if(options.body=='0')
             delete options.body;
        
        
        const rawResponse = await fetch(url, options);
        content = await rawResponse.json();
        
        if(content && rawResponse.status == 200){
            response ={
                status : 1,
                content
            }

            return response

        }else{
            error = {
                status : rawResponse.status,
                statusText : rawResponse.statusText,
                url : rawResponse.url,
                error: content.error,
                post : options.body
            }            
            response = {
                status : 0,
                error
            }

            return response
        }
    },
    webFetch:
    async (url) => {
        
        if(options.body=='0')
            delete options.body;
       
       
       const rawResponse = await fetch(url, options);
       content = await rawResponse.json();
       
       if(content && rawResponse.status == 200){
           response ={
               status : 1,
               content
           }

           return response

       }else{
           error = {
               status : rawResponse.status,
               statusText : rawResponse.statusText,
               url : rawResponse.url,
               error: content.error,
               post : options.body
           }            
           response = {
               status : 0,
               error
           }

           return response
       }
   }

}