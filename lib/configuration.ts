import { PathLike } from "original-fs"
import path from "path"
import { app } from "electron"
import fsPromise from "fs/promises"
const userAppDataPath: PathLike = app.getPath("appData")
const configurationFilePath: PathLike = path.join(
  userAppDataPath,
  `/temp/configuration.json`,
)

export interface Configuration {
  directories: string[]
  theme: "light" | "dark" | "system"
}

const defaultConfiguration: Configuration = {
  directories: [],
  theme: "system",
}

async function readConfiguration(): Promise<Configuration> {
  try {
    console.log(configurationFilePath)

    const configurationFilePathExists: boolean = await fsPromise
      .access(configurationFilePath)
      .then(() => true)
      .catch(() => false)

    if (!configurationFilePathExists) {
      await fsPromise.writeFile(
        configurationFilePath,
        JSON.stringify(defaultConfiguration),
      )
    }

    const configurationFileContent: string = await fsPromise.readFile(
      configurationFilePath,
      "utf-8",
    )

    let configurationFileContentObject: Configuration = JSON.parse(
      configurationFileContent,
    )

    return configurationFileContentObject
  } catch (error) {
    throw error
  }
}

async function writeConfiguration(configuration: Configuration): Promise<void> {
  try {
    let configurationFileContentObject: Configuration =
      await readConfiguration()

    if (configuration.directories) {
      configurationFileContentObject.directories = configuration.directories
    }

    if (configuration.theme) {
      configurationFileContentObject.theme = configuration.theme
    }

    await fsPromise.writeFile(
      configurationFilePath,
      JSON.stringify(configurationFileContentObject),
    )
  } catch (error) {
    throw error
  }
}

export { readConfiguration, writeConfiguration }
