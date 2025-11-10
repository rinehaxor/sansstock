import { jsx } from 'react/jsx-runtime';
import { Toaster as Toaster$1 } from 'react-hot-toast';

const logo = new Proxy({"src":"/_astro/logo.fZHyz6ps.png","width":1024,"height":1024,"format":"png"}, {
						get(target, name, receiver) {
							if (name === 'clone') {
								return structuredClone(target);
							}
							if (name === 'fsPath') {
								return "D:/ProjekGabut/sansstocks/sansstocks/src/assets/logo.png";
							}
							
							return target[name];
						}
					});

function Toaster() {
  return /* @__PURE__ */ jsx(
    Toaster$1,
    {
      position: "top-right",
      toastOptions: {
        duration: 4e3,
        style: {
          background: "#fff",
          color: "#374151",
          border: "1px solid #e5e7eb",
          borderRadius: "0.5rem",
          padding: "12px 16px",
          fontSize: "14px",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
        },
        success: {
          iconTheme: {
            primary: "#10b981",
            secondary: "#fff"
          },
          style: {
            border: "1px solid #10b981"
          }
        },
        error: {
          iconTheme: {
            primary: "#ef4444",
            secondary: "#fff"
          },
          style: {
            border: "1px solid #ef4444"
          }
        }
      }
    }
  );
}

export { Toaster as T, logo as l };
