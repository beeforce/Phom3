import Login from '../Auth/Login'
import Signup from '../Auth/Signup'
import HomeNavigation from '../navigation/HomeNavigation'
import HomeNavigationCustomertype from '../navigation/HomeNavigationCustomertype'
import { createSwitchNavigator } from 'react-navigation'
import { zoomIn, fromLeft } from "react-navigation-transitions";



const AppstackNavigation = createSwitchNavigator({
        Login: Login,
        Homepage: HomeNavigation,
        Signup: Signup,
        HomepageCustomer: HomeNavigationCustomertype
      },
      {transitionConfig: () => fromLeft(600)}
    );


export default AppstackNavigation