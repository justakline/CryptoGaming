const hre = require("hardhat");
const {ethers} = hre

async function main() {


    try {

        const owner = await hre.ethers.provider.getSigner(0);
        const main = await hre.ethers.getContractAt("MainContract", '0xa98EcC81a790A2DC09b54e7646Df51a603c0Ff39' )
        const rps = await hre.ethers.getContractFactory("RockPaperScissors")
        // const newRPS = await rps.deploy()
        console.log(rps)

        
        // const rpsV1 = await hre.ethers.getContractAt("RockPaperScissors", '0xAC2F073afc043eD1Eed64375DCE94C99Dc39A7df' )
        // await console.log(newRPS.runner.address)
        // await console.log(newRPS)
        // main.addPlayableGame(newRPS.runner.address)
        // main.addPlayableGame(newRPS)
    
        
        // const rps = await hre.ethers.getContractFactory("RockPaperScissors")
        // console.log(rps);
        // const rps = await hre.ethers.deployContract("RockPaperScissors",[main, 0], {value:  ethers.parseEther("0")})



    //     // const PieceFactory = await hre.ethers.deployContract("Piece");
    //     // const pieceAddress = await PieceFactory.getAddress();
    //     // console.log("Piece Address = " + pieceAddress);

    //     // const BoardFactory = await hre.ethers.deployContract("Board");
    //     // const boardAddress = await BoardFactory.getAddress();

    //     // console.log("Board Address = " + boardAddress);
    //     let main  = await hre.ethers.deployContract("MainContract")
    // try{
    //     const rps = await hre.ethers.deployContract("RockPaperScissors",[main, 0], {value:  ethers.parseEther("0")})
    //     console.log("fail 1: ");
    // }catch (error) {
    //     console.log("pass 1: " + error.message)
    // }
    // let rps;

    // try{

    //     rps = await hre.ethers.deployContract("RockPaperScissors", [main, 0], {value:ethers.parseEther("0.01") })
    //     console.log("Pass 1: ");
    // }catch (error) {
    //     console.log("Fail 1: " + error.message)
    // }
    // rps = await hre.ethers.deployContract("RockPaperScissors", [main, 0], {value:ethers.parseEther("0.01") })
    // console.log(rps);
    // try{
    //     await rps.payWinner() 
        
    //     console.log("fail 1: ");
    // }catch (error) {
    //      console.log("pass 1: " + error.message)
    // }
    // const playerChoice = await rps.getPlayerChoice()
    // const computerChoice = await rps.getComputerChoice()
    // const isWinner = await rps.getIsWinner()
    // const wagerChoice = await rps.getWagerChoice()
    // const gameOver = await rps.getGameOver()

    // console.log(playerChoice);
    // console.log(computerChoice);
    // console.log(isWinner);
    // console.log(wagerChoice);
    // console.log(gameOver);

   



} catch (error) {
    console.error(error);
}




}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  