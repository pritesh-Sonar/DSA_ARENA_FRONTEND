import axiosInstance from "../../../services/api/axiosInstance";

export const getBotMove = async (board, botSymbol, difficulty) => {
  const response = await axiosInstance.post("/api/game/tictactoe/bot-move", {
    board,
    botSymbol,
    difficulty,
  });
  return response.data;
};