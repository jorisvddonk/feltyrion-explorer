import { Noctis } from "noctis-starmap";
import * as path from "path";

const Starmap = new Noctis(path.join(__dirname, "../../noctis-starmap/starmap2.bin"), path.join(__dirname, "../../noctis-starmap/GUIDE.BIN"));
export default Starmap;