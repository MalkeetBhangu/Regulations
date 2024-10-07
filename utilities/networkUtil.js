/**
 * Class used to detect whether user is conneced to internet or not.
 * @Author Logicease
 * @Architect Sagar Gandhi
 * @Developer Vishal and Anjali
 */
import React, {Component} from 'react';
import NetInfo from "@react-native-community/netinfo";

class NetworkUtility {

checkIsNetwork(){
   return NetInfo.fetch();
}


}
export default new NetworkUtility();