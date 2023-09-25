import fs from "fs";

class FileManager {
  constructor(filename = "/db.json") {
    this.filename = filename;
    this.getObjets();
  }

  generarCode(index) {
    const CODE = "CODE" + (index + 1);
    return CODE;
  }

  writeObjects = async (objects) => {
    try {
      await fs.promises.writeFile(this.filename, JSON.stringify(objects));
    } catch (error) {
      console.error("Error al escribir los archivos:", error);
    }
  };

  getObjets = async () => {
    try {
      const data = await fs.promises.readFile(this.filename, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.log("Error, no se encontró el archivo");
      return [];
    }
  };

  getObjetsById = async (objetID) => {
    const objetsAll = await this.getObjets();
    const object = objetsAll.find((objet) => objet.id === objetID);

    if (object) return object;
    else return console.log("Objeto no identificado.");
  };

  updateObject = async (objectId, updatedFields) => {
    try {
      const objectsAll = await this.getObjets();
      const objectIndex = objectsAll.findIndex(
        (object) => object.id === objectId
      );

      if (objectIndex) {
        const updatedObject = {
          ...objectsAll[objectIndex],
          ...updatedFields,
        };

        objectsAll[objectIndex] = updatedObject;
        await this.writeObjects(objectsAll);

        return updatedObject;
      }
    } catch (error) {
      console.error("Error al actualizar el objecto:", error);
    }
  };

  deleteObjets = async (objectId) => {
    try {
      const objectsAll = await this.getObjets();
      const objectsIndex = objectsAll.findIndex(
        (object) => object.id === objectId
      );

      if (objectsIndex !== -1) {
        const eliminado = objectsAll.splice(objectId, 1);
        await this.writeObjects(objectsAll);

        return eliminado;
      }
    } catch (error) {
      return console.error("Error al eliminar el objeto:", error);
    }
  };
}

export default FileManager;
