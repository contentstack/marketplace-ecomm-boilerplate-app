import React from "react";
import { Icon, Info } from "@contentstack/venus-components";
import { Props } from "../../common/types";
import "./styles.scss";

const WarningMessage: React.FC<Props> = function ({ content }) {
  const infoIcon = <Icon icon="Warning" size="small" />;
  return (
    <Info
      className="component"
      icon={infoIcon}
      content={content}
      type="attention"
    />
  );
};

export default React.memo(WarningMessage);
