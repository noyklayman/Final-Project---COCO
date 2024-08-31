import { useExtrasModalContext } from "../../context/modal.context";
import {
  CategoryTitle,
  ExtrasActions,
  ExtrasContainer,
  ExtrasGrid,
  ExtrasModal,
  RequiredField,
  SelectableItem,
} from "./styles";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import {
  ExtraCategory,
  ExtrasTypeOptionsKey,
  OrderItem,
  coupledOptions,
  extrasTypeOptions,
  flippableOptions,
} from "../../types";
import { useOrderContext } from "../../context/order.context";
import colors from "../../colors";

const isRequiredCategory = (category: string) => {
  if (category === "סוג חלב" || category === "סוג כוס") return true;
  return false;
};

const renderExtras = (
  extras: ExtraCategory,
  selectedExtras: { [category: string]: string[] },
  handleSelect: (category: ExtrasTypeOptionsKey, extra: string) => void
) => {
  const extraComponents: JSX.Element[] = [];
  if (!extras) return extraComponents;
  Object.entries(extras).forEach(([category, options]) => {
    const optionElements: JSX.Element[] = [];
    options.forEach((extra) => {
      optionElements.push(
        <SelectableItem
          key={v4()}
          isselected={selectedExtras[category]?.includes(extra) || false}
          onClick={() => handleSelect(category as ExtrasTypeOptionsKey, extra)}
        >
          {extra}
        </SelectableItem>
      );
    });
    extraComponents.push(
      <div key={v4()}>
        <CategoryTitle>{category}</CategoryTitle>
        <ExtrasGrid>{optionElements}</ExtrasGrid>
        {isRequiredCategory(category) && (
          <RequiredField>
            <hr />
            <div>חובה</div>
          </RequiredField>
        )}
        <hr style={{ marginBlock: "1rem" }} />
      </div>
    );
  });
  return React.Children.toArray(extraComponents);
};

export default function Extras() {
  const { chosenItem, setOpen } = useExtrasModalContext();
  const modalContentRef = React.useRef<HTMLDivElement | null>(null);
  const [selectedExtras, setSelectedExtras] = useState<{ [category: string]: string[] }>({});

  const { addOrderItem } = useOrderContext();
  const [amount, setAmount] = useState(1);

  useEffect(() => {
    return () => {
      setSelectedExtras({});
      setAmount(1);
    };
  }, [chosenItem]);

  const checkHasRequiredExtras = (extras?: ExtraCategory) => {
    if (!extras) return true;
    if (!Object.keys(extras).some((category) => isRequiredCategory(category))) return true;
    return Object.entries(extras).every(([category, options]) => {
      if (isRequiredCategory(category)) {
        return options.some((option) => selectedExtras[category]?.includes(option));
      }
      return true;
    });
  };
  const handleSelect = (category: ExtrasTypeOptionsKey, extra: string) => {
    setSelectedExtras((prev) => {
      const isMultipleChoice = extrasTypeOptions[category];
      const currentSelection = prev[category] || [];
      let updatedSelection = currentSelection;
      // Check if category has flippable options and handle them
      if (flippableOptions[category]) {
        flippableOptions[category].forEach(([option1, option2]) => {
          if (extra === option1 && currentSelection.includes(option2)) {
            updatedSelection = currentSelection.filter((e) => e !== option2);
          } else if (extra === option2 && currentSelection.includes(option1)) {
            updatedSelection = currentSelection.filter((e) => e !== option1);
          }
        });
      }

      // Check if category has coupled options and handle them
      if (coupledOptions[category]) {
        coupledOptions[category].forEach(([option1, option2]) => {
          if (extra === option1 || extra === option2) {
            // Ensure both options are selected together
            if (!currentSelection.includes(option1) || !currentSelection.includes(option2)) {
              updatedSelection = [option1, option2];
            }
          }
        });
        if (extra === "ללא חלב") {
          updatedSelection = [extra];
        } else if (extra === "חלב קר בצד" || extra === "חלב חם בצד") {
          updatedSelection = currentSelection.filter((e) => e !== "ללא חלב");
        } else {
          updatedSelection = currentSelection.filter((e) => e !== "ללא חלב");
        }
      }

      if (isMultipleChoice) {
        return {
          ...prev,
          [category]: updatedSelection.includes(extra)
            ? extra === "ללא חלב"
              ? updatedSelection
              : updatedSelection.filter((e) => e !== extra)
            : [...updatedSelection, extra],
        };
      } else {
        return {
          ...prev,
          [category]: updatedSelection.includes(extra) ? [] : [extra],
        };
      }
    });
  };

  if (!chosenItem) return null;

  return (
    <ExtrasModal
      onClick={(event) => {
        const element = event.target as HTMLElement;
        // check if the click is outside the modal and its children
        if (element.id === "modal-content" || modalContentRef.current?.contains(element)) return;
        setOpen(undefined);
      }}
    >
      <div className="modal-content" id="modal-content" ref={modalContentRef}>
        <ExtrasContainer>
          {chosenItem.extras && renderExtras(chosenItem.extras, selectedExtras, handleSelect)}
        </ExtrasContainer>
        <ExtrasActions>
          <div className="horizontal">
            <img
              style={{ filter: "invert(1) brightness(2)" }}
              onClick={() => setAmount((a) => a + 1)}
              className="plus"
              src={"https://i.ibb.co/cXSdVpX/plus.png"}
              alt="plus"
            />
            <div style={{ color: colors.light }}>{amount}</div>
            <img
              onClick={() => setAmount((a) => Math.max(1, a - 1))}
              className="minus"
              style={{ filter: "invert(1) brightness(2)" }}
              src={'https://i.ibb.co/2WKNHHB/minus.png'}
              alt="minus"
            />
          </div>
          <button
            disabled={!checkHasRequiredExtras(chosenItem.extras)}
            onClick={() => {
              const orderItem = {
                id: v4(),
                item: chosenItem,
                quantity: amount,
                selectedExtras,
              } as OrderItem;
              addOrderItem(orderItem);
              setOpen(undefined);
              setSelectedExtras({});
            }}
          >
            הוסף להזמנה
          </button>
        </ExtrasActions>
        <br />
        <button
          onClick={() => {
            setOpen(undefined);
            setSelectedExtras({});
          }}
        >
          סגור
        </button>
      </div>
    </ExtrasModal>
  );
}
