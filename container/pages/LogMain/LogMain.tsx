import LogItem from "../../../components/Log/LogItem/LogItem";

import {
  LogItemWrapper,
  LogMainDescription,
  LogMainWrapper,
} from "./LogMainStyle";

import { LogMainProps } from "../../containerType";
import LogCategory from "../../../components/Log/LogCategory/LogCategory";
import useLogMain from "./useLogMain";
// import { LOG } from "../../../lib/config/blogConfig";

const LogMain = ({ allLogs }: LogMainProps) => {
  const { componentProps, filteredLogs } = useLogMain({ allLogs });

  return (
    <LogMainWrapper>
      <LogMainDescription>{}</LogMainDescription>
      <LogCategory {...componentProps.category} />
      <LogItemWrapper>
        {filteredLogs?.map((log) => (
          <LogItem key={log.id} {...log} />
        ))}
      </LogItemWrapper>
    </LogMainWrapper>
  );
};

export default LogMain;
