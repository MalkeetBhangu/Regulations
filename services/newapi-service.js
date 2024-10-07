import { Alert } from 'react-native';
import UserDataService from './user_service';

const baseUrl = 'http://xanababy.t2.customia.com/api/';

export default class APIService {
  getTokenHeader() {
    let token = UserDataService.getAccessToken();

    console.log('token is api ' + token);
    return {
      Authorization: 'Token ' + token,
    };
  }

  /**
   * Login user api
   * @param {*} username
   * @param {*} password
   */
  login(username, password) {
    let formdata = new FormData();
    formdata.append('username', username);
    formdata.append('password', password);

    let requestOptions = {
      method: 'POST',
      body: formdata,
    };

    return fetch(baseUrl + 'users/login/', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('nw api signin res is ' + JSON.stringify(response));
        return response;
      });
  }

  /*
handle SignUp
*/

  signup(name, password, email) {
    let formdata = new FormData();
    formdata.append('first_name', name);
    formdata.append('password', password);
    formdata.append('email', email);

    let requestOptions = {
      method: 'POST',
      //   headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    return fetch(baseUrl + 'users/register/', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('new api signup res is ' + JSON.stringify(response));
        return response;
      })
      .catch(err => {
        console.log(err);
      });
  }

  /*
   * handle OTP verification
   */

  otp_verification(email, password, otp) {
    let formdata = new FormData();
    formdata.append('username', email);
    formdata.append('password', password);
    formdata.append('otp_code', otp);
    let requestOptions = {
      method: 'POST',
      //   headers: myHeaders,
      body: formdata,
      redirect: 'follow',
    };

    return fetch(baseUrl + 'users/login/', requestOptions)
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log('new api otp res is ' + JSON.stringify(response));
        return response;
      })
      .catch(err => console.log(err));
  }

  /**
   * get User Details
   */

  getUserDetails() {
    let requestOptions = {
      method: 'GET',
      headers: this.getTokenHeader(),
    };

    return fetch(baseUrl + 'users/me/', requestOptions)
      .then(response => {
        return response.json();
      })
      .then(response => {
        // console.log('new api otp res is ' + JSON.stringify(response));
        return response;
      })
      .catch(err => console.log(err));
  }

  /*
   * forgot password
   */

  forgotPassword(email) {
    let formdata = new FormData();
    formdata.append('email', email);
    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    return fetch(baseUrl + 'users/change-password/', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(
          'new api forrgot password res is ' + JSON.stringify(response),
        );
        return response;
      });
  }

  /*
  * check OTP when clicking forgot password
  */

 checkOTP(otp) {
  let formdata = new FormData();
  formdata.append('otp_code', otp);
  let requestOptions = {
    method: 'POST',
    body: formdata,
    redirect: 'follow',
  };

  return fetch(baseUrl + 'check-otp/', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log(
        'check otp response is ' + JSON.stringify(response),
      );
      return response;
    });
}


  /*
   * change password
   */

  changePassword(otp, password) {
    let formdata = new FormData();
    formdata.append('otp_code', otp);
    formdata.append('new_password', password);
    let requestOptions = {
      method: 'POST',
      body: formdata,
      redirect: 'follow',
    };

    return fetch(baseUrl + 'users/change-password/', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(
          'new api forrgot password res is ' + JSON.stringify(response),
        );
        return response;
      });
  }

  /*
   * add a baby
   */

  babyRegistration(
    image,
    babyName,
    gender,
    dob,
    dueDate,
    bedTime,
    wakeTime,
    napsCount,
    feedBreast,
    feedBottle,
    feedFood,
  ) {
    let formdata = new FormData();

    if (image) {
      formdata.append('photo', {
        uri: image,
        name: 'photo.png',
        type: 'image/png',
      });
    }

    formdata.append('name', babyName);
    formdata.append('gender', gender);
    formdata.append('date_of_birth', dob);
    formdata.append('due_date', dueDate);
    formdata.append('bed_time', bedTime);
    formdata.append('wakeup_time', wakeTime);
    formdata.append('naps_per_day', napsCount);
    formdata.append('feeding_breast', feedBreast);
    formdata.append('feeding_bottle', feedBottle);
    formdata.append('feeding_food', feedFood);

    let requestOptions = {
      method: 'POST',
      headers: this.getTokenHeader(),
      body: formdata,
      redirect: 'follow',
    };

    return fetch(baseUrl + 'babies/', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(
          'new api baby registration res is ' + JSON.stringify(response),
        );
        return response;
      })
      .catch(err => console.log(err));
  }

  /*
   * get babies
   */

  getBabies() {
    let requestOptions = {
      method: 'GET',
      headers: this.getTokenHeader(),
    };

    return fetch(baseUrl + 'babies/', requestOptions)
      .then(response => {
        return response.json();
      })
      .then(response => {
        console.log('new api get babies res is ' + JSON.stringify(response));
        return response;
      })
      .catch(err => console.log(err));
  }

  /*
   * edit a baby
   */

  editBaby(
    image,
    babyid,
    name,
    dob,
    dueDate,
    wakeTime,
    bedTime,
    napsCount,
    feedBreast,
    feedBottle,
    feedFood
  ) {
    let formdata = new FormData();

    if (image) {
      formdata.append('photo', {
        uri: image,
        name: 'photo.png',
        type: 'image/png',
      });
    }

    formdata.append('baby_id', babyid);
    formdata.append('name', name);
    formdata.append('date_of_birth', dob);
    formdata.append('due_date', dueDate);
    formdata.append('wakeup_time', wakeTime);
    formdata.append('bed_time', bedTime);
    formdata.append('naps_per_day', napsCount);
    formdata.append('feeding_breast', feedBreast);
    formdata.append('feeding_bottle', feedBottle);
    formdata.append('feeding_food', feedFood);

    let requestOptions = {
      method: 'PATCH',
      headers: this.getTokenHeader(),
      body: formdata,
      redirect: 'follow',
    };

    return fetch(baseUrl + '/babies/' + babyid + '/', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('new api edit baby res is ' + JSON.stringify(response));
        return response;
      })
      .catch(err => console.log(err));
  }

  /*
   * delete a baby
   */

  deleteBaby(babyid) {
    let requestOptions = {
      method: 'DELETE',
      headers: this.getTokenHeader(),
    };

    return fetch(baseUrl + '/babies/' + babyid + '/', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log('new api delete res is ' + JSON.stringify(response));
        return response;
      })
      .catch(err => console.log(err));
  }

  /*
   * update contact
   */

  updateContact(message) {
    let formdata = new FormData();
    formdata.append('app_message', message);
    let requestOptions = {
      method: 'PATCH',
      headers: this.getTokenHeader(),
      body: formdata,
      redirect: 'follow',
    };

    return fetch(baseUrl + '/users/me/', requestOptions)
      .then(response => response.json())
      .then(response => {
        console.log(
          'new api update contact res is ' + JSON.stringify(response),
        );
        return response;
      })
      .catch(err => console.log(err));
  }

  /*
  * add a sleep
  */
 sleepRegistration(babyid, startTime, stopTime) {
  let formdata = new FormData();
  formdata.append('baby_id', babyid);
  formdata.append('start_time', startTime);
  formdata.append('stop_time', stopTime);
  let requestOptions = {
    method: 'POST',
    headers: this.getTokenHeader(),
    body: formdata,
    redirect: 'follow',
  };

  return fetch(baseUrl + 'sleeps/', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log(
        'new api add a sleep res is ' + JSON.stringify(response),
      );
      return response;
    })
    .catch(err => console.log(err));
}

/*
* edit a sleep
*/

updateSleepRegistration(startid, stopid, starttime, stoptime) {
  let formdata = new FormData();
  formdata.append('start_sleep_id', startid);
  formdata.append('stop_sleep_id', stopid);
  formdata.append('start_time', starttime);
  formdata.append('stop_time', stoptime);
  let requestOptions = {
    method: 'PUT',
    headers: this.getTokenHeader(),
    body: formdata,
    redirect: 'follow',
  };

  return fetch(baseUrl + 'sleeps/block-update/', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log(
        'new api update sleep res is ' + JSON.stringify(response),
      );
      return response;
    })
    .catch(err => console.log(err));
}

/*
* delete a sleep
*/

deleteSleepRegistration(startid, stopid) {
  let formdata = new FormData();
  formdata.append('start_sleep_id', startid);
  formdata.append('stop_sleep_id', stopid);

  let requestOptions = {
    method: 'DELETE',
    headers: this.getTokenHeader(),
    body: formdata,
    redirect: 'follow',
  };

  return fetch(baseUrl + 'sleeps/remove/', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log(
        'new api delete a sleep res is ' + JSON.stringify(response),
      );
      return response;
    })
    .catch(err => console.log(err));
}

/*
* get all Sleeps
*/

getAllSleepRegistration() {
  let requestOptions = {
    method: 'GET',
    headers: this.getTokenHeader(),
  };

  return fetch(baseUrl + 'sleeps/', requestOptions)
    .then(response => {
      return response.json();
    })
    .then(response => {
     //  console.log('new api all sleep data res is ' + JSON.stringify(response));
      return response;
    })
    .catch(err => console.log(err));
}

/*
* get next sleep
*/

getNextSleep(id){
 
  let requestOptions = {
    method: 'POST',
    headers: this.getTokenHeader(),
    redirect: 'follow',
  };

  return fetch(baseUrl + 'babies/' + id + '/next-sleep/', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log(
        'next sleep API response ' + JSON.stringify(response),
      );
      return response;
    })
    .catch(err => console.log(err));
}


GraphDetails() {
  console.log("token result"+ JSON.stringify(this.getTokenHeader()))
  let requestOptions = {
    method: 'GET',
    headers: this.getTokenHeader(),
  };

  return fetch(baseUrl + '/babies/' +483+ '/daily-statistics', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('new api graph res is ' + JSON.stringify(response));
      return response;
    })
    .catch(err => console.log(err));
}

weekGraphDetails(babyId) {
  console.log("token result"+ JSON.stringify(this.getTokenHeader()))
  let requestOptions = {
    method: 'GET',
    headers: this.getTokenHeader(),
  };

  return fetch(baseUrl + '/babies/' +babyId + '/weekly-statistics', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('new api graph res is ' + JSON.stringify(response));
      return response;
    })
    .catch(err => console.log(err));
}


deleteBabySleep(babyid) {
    let requestOptions = {
      method: 'DELETE',
      headers: this.getTokenHeader(),
    };

    return fetch(baseUrl + '/babies?id=' + babyid , requestOptions)
    console.log("ApiUrl"+baseUrl + '/babies?id=' + babyid)
      .then(response => response.json())
      .then(response => {
        console.log('new api delete res is ' + JSON.stringify(response));
        return response;
      })
      .catch(err => console.log("error is "+err));
  }

  
editprofile() {
  console.log("token result"+ JSON.stringify(this.getTokenHeader()))
  let requestOptions = {
    method: 'GET',
    headers: this.getTokenHeader(),
  };

  return fetch(baseUrl + '/users/' +'/me/', requestOptions)
    .then(response => response.json())
    .then(response => {
      console.log('new api of edit profile is' + JSON.stringify(response));
      return response;
    })
    .catch(err => console.log(err));
}


exportSleepDetails(baby_id) {
    let formdata = new FormData();
    // let baby_id =babyid;
    formdata.append('babyId', baby_id);
    let requestOptions = {
      method: 'POST',
      body: formdata,
      headers: this.getTokenHeader(),
      redirect: 'follow',
    };

    return fetch(baseUrl +'/babies/'+ baby_id +'/export-sleeps/', requestOptions)
      .then(response => response.json())
      .then(response => {

      alert(response.ok)
        console.log(
          'new api export baby data ' + JSON.stringify(response),
        );
        return response;
      });
  }

}




