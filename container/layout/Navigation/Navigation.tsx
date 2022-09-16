import { NAVIGATION } from "../../../lib/config/blogConfig";

import { ROUTES } from "../../../lib/config/routeConfig";

import {
  NavigationSubWrapper,
  NavigationWrapper,
  NavigationAnchor,
  NavigationLogo,
  NavigationContainer,
} from "./NavigationStyle";

const Navigation = () => {
  return (
    <NavigationWrapper>
      <NavigationContainer>
        <NavigationLogo href={ROUTES.MAIN}>{NAVIGATION.TITLE}</NavigationLogo>
        <NavigationSubWrapper>
          <NavigationAnchor href={ROUTES.ABOUT}>
            {NAVIGATION.ABOUT}
          </NavigationAnchor>
        </NavigationSubWrapper>
      </NavigationContainer>
    </NavigationWrapper>
  );
};

export default Navigation;
