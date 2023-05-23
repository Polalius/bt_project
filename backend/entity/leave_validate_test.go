package entity

import (
	"testing"
	

	"github.com/asaskevich/govalidator"
	. "github.com/onsi/gomega"
)

func TestPassLeave(t *testing.T) {
	g :=NewGomegaWithT(t)

	leave := LeaveList{
		StartTime: 240,
		StopTime: 480,
	}
	ok, err := govalidator.ValidateStruct(leave)

	g.Expect(ok).To(BeTrue())

	g.Expect(err).To(BeNil())
}
func TestStartTimeNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	
	leave := LeaveList{
		StopTime: 480,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(leave)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องเป็น nil แปลว่าไม่มี error
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("กรุณากรอกวันที่และเวลา"))
}
func TestStopTimeNotBlank(t *testing.T) {
	g := NewGomegaWithT(t)

	
	leave := LeaveList{
		StartTime: 240,
	}

	// ตรวจสอบด้วย govalidator
	ok, err := govalidator.ValidateStruct(leave)

	// ok ต้องเป็น true แปลว่าไม่มี error
	g.Expect(ok).ToNot(BeTrue())

	// err ต้องเป็น nil แปลว่าไม่มี error
	g.Expect(err).ToNot(BeNil())
	g.Expect(err.Error()).To(Equal("กรุณากรอกวันที่และเวลา"))
}
