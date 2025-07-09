import Request from "../../request/Request.js";
import S3HandlerResponse from "./S3HandlerResponse.js";

export default abstract class S3HandlerAbstract {
  public abstract getFile(request: Request): Promise<S3HandlerResponse>
  public abstract uploadFile(request: Request): Promise<S3HandlerResponse>
  public abstract deleteFile(request: Request): Promise<S3HandlerResponse>
}