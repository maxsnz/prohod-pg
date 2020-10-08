import instance from './instance';

const getData = () => 
  instance.get(`/api/data`);

const postData = data => 
  instance.post(`/api/data`, { data });


export default { getData, postData };