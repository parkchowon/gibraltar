export const generateRandomHandle = ()=>{
  const characters = "abcdefghijklmnopqrstuvwxyz0123456789"
  let handle = '';

  for(let i = 0; i< 11; i++){
    const randomIndex = Math.floor(Math.random()*characters.length);
    handle += characters[randomIndex];
  }
  return handle;
}