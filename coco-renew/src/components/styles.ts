import colors from "../colors";
import styled from "styled-components";

export const hoverEffect = (btn: boolean = false) => `
&:hover {
    cursor: pointer;
    transform: scale(1.01) ${btn ? `translateX(40px)` : ""};;
}
`;

export const MenuContainer = styled.div`
  box-shadow: inset rgba(0, 0, 0, 0.4) 1px 0px 30px 5px;
  background: rgba(0, 0, 0, 0.1);
  filter: blur(40%);
  .menu {
    color: black;
    ${hoverEffect(false)}
  }
  width: max(25%, 200px);
  .center {
    color: rgba(0, 0, 0, 0.8);
    right: calc(50% - 30px);
  }
  font-size: 13px;
  .center-2 {
    transform: translateY(-20px) translateX(-2px) rotate(12deg);
  }
  .btn {
    background: rgba(228, 182, 167, 0.9);
    transform: translateX(40px);
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    width: calc(100% + 40px);
    box-shadow: rgba(0, 0, 0, 0.4) 1px 0px 10px 2px;
    ${hoverEffect(true)}
  }
  .text {
    transform: translateX(-12px);
    display: block;
  }
  .image {
  }
`;

export const CategoriesBar = styled.div`
  background: ${colors.light};
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  padding: 0.5rem;
  margin: 8px;
  position: relative;
  width: 100%;
  justify-content: space-evenly;
  text-align: center;
  align-items: center;

  display: flex;
  flex-direction: row;
  overflow-x: scroll;
  align-items: center;
  gap: 0.25rem;

  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none;
  }
  p {
    padding-block: 4px;
    padding-inline: 1rem;
    width: max-content;
    display: flex;
    text-align: start;
    font-weight: bold;
    cursor: pointer;
    color: ${colors.dark};
    white-space: nowrap; /* Prevents the text from wrapping */
  }

  @media only screen and (max-width: 800px) {
    margin-inline: auto;
    max-width: 95%;
  }
`;

export const CategoriesBarContainer = styled.div`
  position: relative;
  margin-right: 64px;
  width: 100%;
  justify-content: space-evenly;
  text-align: center;
  align-items: center;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  ::-webkit-scrollbar {
    display: none;
  }
`;
export const IconInput = styled.input`
  position: relative;
  background: ${colors.light};
  outline: none;
  height: 50px;
  padding-block: 4px;
  padding-left: 8px;
  padding-right: 4px;
`;

export const SelectedItem = styled.p`
  position: relative;
  &:after {
    background: ${colors.main};
    content: "";
    display: block;
    position: absolute;
    bottom: 0;
    left: 0;
    height: 4px;
    right: 0;
  }
`;

export const ItemListContainer = styled.div`
  display: flex;
  box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
  flex-wrap: wrap;
  direction: rtl;
  justify-content: center;
  align-content: flex-start;
  width: 100%;
  height: 700px;
  overflow-y: scroll;
  gap: 1rem;
  padding: 1rem;
  background: ${colors.light};
  margin: 8px;
  .item-card {
    box-shadow: rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;
    border-radius: 8px;
    padding: 1rem;
    width: 250px;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    background: white;
    gap: 1rem;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    ${hoverEffect()}

    @media only screen and (max-width: 800px) {
      // shrink it abit so it fits 2 columns
      width: 200px;
      height: 120px;
    }
    @media only screen and (max-width: 400px) {
      // shrink it abit so it fits 2 columns
      width: 150px;
      height: 130px;
      font-size: 16px;
    }

    @media only screen and (min-width: 900px) {
      height: 120px;
    }
  }
`;
