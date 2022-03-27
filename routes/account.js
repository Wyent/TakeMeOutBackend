import {
    users as sampleUsers,
    breaches as sampleBreaches,
    response as sampleResponse
  } from "./sample";
  
  function authenticate(email, password) {
    const account = sampleUsers.find(a => a.email === email);
    if (account && account.password === password) {
      return account;
    } else {
      return null;
    }
  }
  
  async function login(email, password) {
    const account = authenticate(email, password);
    breach=[]
    if (account) {
      
      if (sampleResponse.length > 0) {
         sampleResponse.forEach((element) => {
           if(element.IsSensitive===false&& element.DataClasses.includes('Passwords')
              &&(element.AddedDate)>account.lastLogin){
           var result={name:element.Name,domain:element.Domain,breachDate:element.BreachDate,addedDate:element.AddedDate}
           breach.push(result)
           }
        })
         
        return {
          success: true,
          meta: {
            suggestPasswordChange: true,
            // hardcoded for now...
            breachedAccounts: breach
          }
        }
        
      } else {
        return { success: true };
      }
    } else {
      return {
        success: false,
        message: "The username or password you entered is invalid."
      };
    }
  }

  
  export default login;
  