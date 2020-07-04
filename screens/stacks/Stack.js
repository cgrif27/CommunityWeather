import { createStackNavigator } from "react-navigation-stack";
import Captions from "./Captions";
import ChangePassword from "./ChangePassword";
import { createAppContainer } from "react-navigation";
import AccountSettings from "../AccountSettings";
import getColor from "../../localFunctions/getColor";
import EditCaption from "../EditCaption";
import {
  useFonts,
  Inter_200ExtraLight,
  Inter_300Light,
  Inter_500Medium,
} from "@expo-google-fonts/inter";
function loadFonts() {
  let [fontsLoaded] = useFonts({
    Inter_200ExtraLight,
    Inter_300Light,
    Inter_500Medium,
  });
}

//creating stack navigator
const HomeStack = createStackNavigator(
  {
    AccountSettings: {
      screen: AccountSettings,
      navigationOptions: {
        title: "Account Settings",
      },
    },
    Captions: {
      screen: Captions,
      navigationOptions: {
        title: "Captions",
      },
    },
    ChangePassword: {
      screen: ChangePassword,
      navigationOptions: {
        title: "Change Password",
      },
    },
    EditCaption: {
      screen: EditCaption,
      navigationOptions: {
        title: "Edit Caption",
      },
    },
  },
  {
    defaultNavigationOptions: {
      headerStyle: {
        // backgroundColor: getColor(),
        backgroundColor: "white",
      },
      headerTintColor: "#333",
      headerTitleStyle: {
        fontFamily: "Inter_500Medium",
      },
    },
  }
);

export default createAppContainer(HomeStack);
