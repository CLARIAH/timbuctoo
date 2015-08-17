package nl.knaw.huygens.timbuctoo.index;

import nl.knaw.huygens.timbuctoo.model.DomainEntity;

public class IndexRequest {

  public static final String INDEX_ALL = "Index all";
  private String desc;
  private Class<? extends DomainEntity> type;
  private Status status;

  private IndexRequest() {
    status = Status.REQUESTED;
  }

  public static IndexRequest indexAll() {
    IndexRequest indexRequest = new IndexRequest();
    indexRequest.setDesc(INDEX_ALL);

    return indexRequest;
  }

  private void setDesc(String desc) {
    this.desc = desc;
  }

  public String getDesc() {
    return desc;
  }

  public String toClientRep() {
    return String.format("{\"desc\":\"%s\", \"status\":\"%s\"}", desc, status);
  }

  public Class<? extends DomainEntity> getType() {
    return type;
  }


  public static IndexRequest forType(Class<? extends DomainEntity> type) {
    IndexRequest indexRequest = new IndexRequest();
    indexRequest.setType(type);
    return indexRequest;
  }

  private void setType(Class<? extends DomainEntity> type) {
    this.setDesc(String.format("Index request for [%s]", type));
    this.type = type;
  }

  public Status getStatus() {
    return status;
  }

  public void inProgress() {
    status = Status.IN_PROGRESS;
  }

  public void done() {
    status = Status.DONE;
  }

  public enum Status {
    REQUESTED,
    IN_PROGRESS,
    DONE
  }
}