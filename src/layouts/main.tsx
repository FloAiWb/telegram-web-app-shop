// src/layouts/Main.tsx

import React from "react";
import { useThemeParams } from "@vkruglikov/react-telegram-web-app";
import { ConfigProvider, theme } from "antd";
import ru_RU from "antd/locale/ru_RU";

interface Props {
  children: React.ReactNode;
}

const Main: React.FC<Props> = ({ children }) => {
  const [colorScheme, themeParams] = useThemeParams();

  const customizeRenderEmpty = () => (
    <div style={{ textAlign: "center" }}>
      <p>Данных нет</p>
    </div>
  );

  return (
    <div className="app w-full py-1">
      <div className="w-full !max-w-[450px]">
        <ConfigProvider
          direction="ltr"
          locale={ru_RU}
          renderEmpty={customizeRenderEmpty}
          theme={
            themeParams.text_color
              ? {
                  algorithm:
                    colorScheme === "dark"
                      ? theme.darkAlgorithm
                      : theme.defaultAlgorithm,
                  token: {
                    colorText: themeParams.text_color,
                    colorPrimary: themeParams.button_color,
                    colorBgBase: themeParams.bg_color
                  }
                }
              : undefined
          }
        >
          <div className="contentWrapper">{children}</div>
        </ConfigProvider>
      </div>
    </div>
  );
};

export default Main;
