import colors from "../../colors";
import styled from "styled-components";

export const ExtrasModal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  .modal-content {
    background: ${colors.dark};
    padding: 1rem;
    border-radius: 8px;
    width: 80%;
    max-width: 500px;
    max-height: 700px;
    overflow-y: scroll;
    animation: fadeSlideIn 0.3s ease;
    ::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

     button {
    background: ${colors.light};
    color: ${colors.dark};
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    width: 90%;
    display: block;
    margin-inline: auto;
    cursor: pointer;
    margin-top: 1rem;
    margin-bottom: .25rem;

    &:hover {
      background: white;
    }
      &:active {
      background: whitesmoke;
    }
    &:nth-child(3) {
      background: #bd3333;
      margin-top: 0;
    }
    &:disabled {
      background: #ccc;
      color: #666;
      cursor: not-allowed;
    }
  }
  @keyframes fadeSlideIn {
    from {
      opacity: 0;
      transform: translateX(-50%);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
`;

// Styled-components
export const ExtraItem = styled.div`
  padding: 0.5rem;
  background: #f4f4f4;
  margin: 0.25rem 0;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
`;

export const ExtrasContainer = styled.div`
  display: flex;
  direction: rtl;
  flex-direction: column;
  gap: 0.5rem;
`;
export const ExtrasActions = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-top: 1rem;
  align-items: center;
  border: 1px solid #ddd;
  padding: .5rem;
  border-radius: 4px;
  .horizontal {
    display: flex;  
    width: 100%;
    justify-content: space-around;
    align-items: center;
  }
  img {
    cursor: pointer;
    width: 1.5rem;
    height: 1.5rem;

    &:hover {
      transform: scale(1.1);
      transition: transform 0.2s;
    }
      &:active {
      transform: scale(0.9);
      transition: transform 0.2s;
}
   }
 
`;
export const ExtrasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  direction: rtl;
  flex-direction: column;
  gap: 0.5rem;
`;

export const RequiredField = styled.div`
  color: red;
  font-size: 0.8rem;
  display: flex;
  padding: 0.5rem;
  filter:brightness(150%);
  justify-content: flex-end;
  div {
    font-weight: bold;
    border: 1px solid red;
    transform:translateY(-3rem);
    opacity: 0.6;

    background-color: #FF000010;
    border-radius: 4px;
    padding: 0.5rem;
  }
`;
export const SelectableItem = styled.div<{ isselected: boolean }>`
  padding: 0.5rem;
  background: ${(props) => (props.isselected ? "#AF6427" : colors.light)};
  margin: 0.25rem 0;
  border-radius: 4px;
  text-align: center;
  font-size: 1rem;
  color: ${(props) => (props.isselected ? "white" : "#333")};
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.isselected ? "#8a4a1f" : "#e0e0e0")};
  }
`;

export const CategoryTitle = styled.h2`
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
  color: ${colors.light};
`;
