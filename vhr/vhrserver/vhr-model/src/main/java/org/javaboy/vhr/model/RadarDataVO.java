package org.javaboy.vhr.model;

public class RadarDataVO {
    private Integer employeeId;
    private String employeeName;
    private String workID;
    private double tenure;
    private double positionExp;
    private double expertise;
    private double evaluation;
    private double contribution;
    private double rewardPoints;

    public Integer getEmployeeId() {
        return employeeId;
    }

    public void setEmployeeId(Integer employeeId) {
        this.employeeId = employeeId;
    }

    public String getEmployeeName() {
        return employeeName;
    }

    public void setEmployeeName(String employeeName) {
        this.employeeName = employeeName;
    }

    public String getWorkID() {
        return workID;
    }

    public void setWorkID(String workID) {
        this.workID = workID;
    }

    public double getTenure() {
        return tenure;
    }

    public void setTenure(double tenure) {
        this.tenure = tenure;
    }

    public double getPositionExp() {
        return positionExp;
    }

    public void setPositionExp(double positionExp) {
        this.positionExp = positionExp;
    }

    public double getExpertise() {
        return expertise;
    }

    public void setExpertise(double expertise) {
        this.expertise = expertise;
    }

    public double getEvaluation() {
        return evaluation;
    }

    public void setEvaluation(double evaluation) {
        this.evaluation = evaluation;
    }

    public double getContribution() {
        return contribution;
    }

    public void setContribution(double contribution) {
        this.contribution = contribution;
    }

    public double getRewardPoints() {
        return rewardPoints;
    }

    public void setRewardPoints(double rewardPoints) {
        this.rewardPoints = rewardPoints;
    }
}
