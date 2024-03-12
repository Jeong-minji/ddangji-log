import { NAVIGATION } from "../../../lib/config/blogConfig";

import { ROUTES } from "../../../lib/config/routeConfig";

import {
  NavigationWrapper,
  NavigationLogo,
  NavigationContainer,
} from "./NavigationStyle";

const Navigation = () => {
  return (
    <NavigationWrapper>
      <NavigationContainer>
        <NavigationLogo href={ROUTES.MAIN}>{NAVIGATION.TITLE}</NavigationLogo>
      </NavigationContainer>
    </NavigationWrapper>
  );
};

export default Navigation;
