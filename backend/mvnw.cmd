@REM Maven Wrapper Script for Windows
@ECHO OFF
SET MAVEN_PROJECTBASEDIR=%~dp0
SET MVNW_REPOURL=https://repo.maven.apache.org/maven2
IF NOT EXIST "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" (
  CALL mvn -N wrapper:wrapper -Dmaven=3.9.6
)
SET MAVEN_OPTS=--add-opens java.base/java.lang=ALL-UNNAMED
CALL "%MAVEN_PROJECTBASEDIR%\.mvn\wrapper\maven-wrapper.jar" %*
